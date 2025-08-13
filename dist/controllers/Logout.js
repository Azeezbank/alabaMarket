export const Logout = async (req, res) => {
    // If using cookies:
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
    return res.json({ message: "Logged out successfully" });
};
