export default class CMath {


    /** REST **/
    
    /**
     * This function converts hours in to miliseconds
     * @param {Number} hours
     * @return {Number} hours in miliseconds
     */
    public static hoursToMilis(hours: number): number {
        return hours * 60 * 60 * 1000
    }


    /**
     * This function converts minutes in to miliseconds
     * @param {Number} minutes
     * @return {Number} minutes in miliseconds
     */
    public static minutesToMilis(minutes: number): number {
        return minutes * 60 * 1000
    }


    /**
     * This function converts bytes in to megabytes
     * @param {Number} bytes
     * @return {Number} bytes in megabytes
     */
    public static bytesToMegas(bytes: number): number{
        return bytes / 1000000
    }


    /**
     * This function returns a random number
     * @param {Number} min 
     * @param {Number} max 
     */
    public static rand(min: number = 0, max: number = 1): number {
        return Math.floor((Math.random() * max) + min)
    }
}