export const configurationen = () => {
    return {
        port: process.env.PORT_BD,
        ACCESKEY:process.env.ACCESKEY,
        HOST:process.env.HOST,
        PASSWORD:process.env.PASSWORD,
        SECRETKEY:process.env.SECRETKEY,
        USERNAME:process.env.USERNAME,
        API_OPEN:process.env.API_OPEN,
        API_ORG:process.env.API_ORG
    }
}