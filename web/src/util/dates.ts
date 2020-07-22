export const epochToDate = (epoch: string): string => {
    const epochNumber = parseInt(epoch);
    const date = new Date(0);
    date.setUTCMilliseconds(epochNumber);
    return date.toDateString()
}