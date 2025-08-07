export const valideURLConvert = (name = "") => {
    const sanitized = name
        ?.toString()
        .replaceAll(" ", "-")
        .replaceAll(",", "-")
        .replaceAll("&", "-");
        
    return encodeURIComponent(sanitized);
}
