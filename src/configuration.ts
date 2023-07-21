export const configurationen = () => {
    return {
        port: process.env.PORT_BD,
        ACCESKEY:process.env.ACCESKEY,
        HOST:process.env.HOST,
        PASSWORD:process.env.PASSWORD,
        SECRETKEY:process.env.SECRETKEY,
        USERNAME:process.env.USERNAME
    }
}