import otpGenerator from "otp-generator";
export const generateOtp=async()=>{
    const otp= await otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    return otp;
}

export const generateCode=async()=>{
    const code= await otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    return code;
}
