import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //to register a user we need to follow the steps
  //: get user deatils {i,e user details}
  //: validations - not empty
  //:check if user already exists - unique email and username
  //:check for images ,check for avatar
  //:upload them to cloudiniry, avatar
  //: create user object - create entry in db
  //:remove password from refresh token field from response
  //:check for user creation
  //:return response

  //s1
  const { fullName, email, username, password } = req.body;
  console.log("email: " + email);
  //s2
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //s3
  const existedUser = User.findOne({ $or: [{ fullName }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  //s4
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  //s5
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  //s6

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  //s7
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }
  //s8

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
export { registerUser };
