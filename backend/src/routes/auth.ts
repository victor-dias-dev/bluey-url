import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(server: FastifyInstance) {
  // Register
  server.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    
    if (existingUser) {
      return reply.code(409).send({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        plan: 'FREE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
      },
    });
    
    // Generate JWT token
    const token = server.jwt.sign({ userId: user.id }, { expiresIn: '7d' });
    
    return reply.code(201).send({
      user,
      token,
    });
  });
  
  // Login
  server.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(body.password, user.password);
    
    if (!isValid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = server.jwt.sign({ userId: user.id }, { expiresIn: '7d' });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      token,
    };
  });
  
  // Get current user
  server.get('/me', {
    preHandler: [server.authenticate],
  }, async (request: FastifyRequest) => {
    const { userId } = request.user as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
      },
    });
    
    return user;
  });
}

