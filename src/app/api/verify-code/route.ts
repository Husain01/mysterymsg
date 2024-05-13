import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

export async function POST(req:Request) {
    await dbConnect();

    try {
      const {username, code} = await req.json() 
      const decodedUser = decodeURIComponent(username)

      const user = await UserModel.findOne({username: decodedUser, })
      if(!user) {
        return Response.json(
            {
                status: false,
                message: "User not found",
            },
            {
                status: 500
            }
        )
      }

      const isCodeValid = user.verifyCode === code
      const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

      if(isCodeValid && isCodeExpired) {
        user.isVerified = true
        await user.save()
        return Response.json(
            {
                status: true,
                message: "User verified successfully",
            }
        )
      } else if(!isCodeValid) {
        return Response.json(
            {
                status: false,
                message: "Invalid verification code",
            },
            {
                status: 400
            }
        )
      } else if(!isCodeExpired) {
        return Response.json(
            {
                status: false,
                message: "Verification code has expired, please signup again to get a new code.",
            },
            {
                status: 400
            }
        )
      }
      
    } catch (error) {
        console.error("Error verifying user: ", error);
        return Response.json(
            {
                status: false,
                message: "Internal server error",
            },
            {
                status: 500
            }
        )
    }
}