export function createUser(username: string) {
    localStorage.setItem("username", username);
}
export function checkUserExists() {
    if (localStorage.getItem("username") == null) {
        return false;
    }
    return true;
}
export function getUserName() {
    return localStorage.getItem("username");
}