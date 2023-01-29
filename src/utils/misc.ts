export const reverse2d = <T = any>(arr: T[][]): T[][] => {
    const helper = <T>(a: T[]) => a.slice(0).reverse();
    return helper(arr).map(helper);
}