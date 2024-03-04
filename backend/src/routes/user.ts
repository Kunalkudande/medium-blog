import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInputs, signinInputs } from "@kunalnpm/medium-common"

export const userRouter = new Hono<{
    Bindings:{                        //because of typescript 
      DATABASE_URL: string,
      JWT_SECRET: string,
    }
  }>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signupInputs.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs are not correct"
      })
    }

  try{
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      },
    })
  
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json({jwt})
  }
  catch(e){
    c.status(404);  
    return c.json({
      error: "Error while signup",
    })
  }
  
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signinInputs.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message: "Inputs are not correct"
      })
    }
  
    try{
      const user = await prisma.user.findUnique({
        where:{
          username: body.username,
          password: body.password
        }
      })
      if(!user){
        c.status(402);
        return c.json("User not found");
      }
  
      const jwt = await sign({
        id: user.id
      }, c.env.JWT_SECRET);
  
      return c.json({jwt});
    }
    catch(e){
      c.status(404);
      return c.json({
        error: "Error",
      })
    }
  })