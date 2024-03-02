import otpGenerator from "otp-generator";
const generateOtp=async()=>{
    const otp= await otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    return otp;
}
export default generateOtp;