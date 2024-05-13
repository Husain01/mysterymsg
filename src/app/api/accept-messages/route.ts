import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        status: true,
        message: "User status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages: ", error);
    return Response.json(
      {
        status: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
  if (!foundUser) {
    return Response.json(
      {
        status: false,
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }
  return Response.json(
    {
      status: true,
      message: "User found",
      isAcceptingMessage: foundUser.isAcceptingMessage,
    },
    {
      status: 200,
    }
  );
  } catch (error) {
    console.log("Failed to update user status to accept messages: ", error);
    return Response.json(
      {
        status: false,
        message: "Failed to get user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}
