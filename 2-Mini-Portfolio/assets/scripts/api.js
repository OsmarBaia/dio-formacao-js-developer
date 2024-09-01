export async function fetchProfileData() {
    // const url = 'https://raw.githubusercontent.com/OsmarBaia/dio-formacao-js-developer/main/2-Mini-Portfolio/data/profile.json';
    const url = "http://localhost:63342/dio-formacao-js-developer/2-Mini-Portfolio/data/profile.json";
    const response = await fetch(url)
    return await response.json()
}