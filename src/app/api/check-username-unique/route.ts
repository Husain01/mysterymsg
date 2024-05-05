import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username:usernameValidation,
    });

    export async function GET(request: Request){
        await dbConnect();

        try {
            const {searchParams} = new URL(request.url);
            const queryParam = {
                username: searchParams.get("username"),
            }

            // validate using zod 
            const result = UsernameQuerySchema.safeParse(queryParam);
            console.log(result) //TODO: remove this line
            if(!result.success){
                const usernameErrors = result.error.format().username?._errors || []
                return Response.json(
                    {
                        status: false,
                        message: usernameErrors?.length > 0 ?  usernameErrors.join(", ") : "Invalid query parameters",
                    },
                    {
                        status: 400
                    }
                )
            }

            const {username} = result.data;

            const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

            if(existingVerifiedUser){
                return Response.json(
                    {
                        status: false,
                        message: "Username already taken",
                    },
                    {
                        status: 409
                    }
                )
            }

            return Response.json(
                {
                    status: true,
                    message: "Username is unique",
                }
            )
        } catch (error) {
            console.error("Error checking username uniqueness: ", error);
            return Response.json(
                {
                    status: false,
                    message: "Error checking username uniqueness",
                },
                {
                    status: 500
                }
            )
        }
    }