
export const ValidationFormatter = (ValidationErrors) => {
    const errors: any[] = [];
    ValidationErrors.forEach(error => {
        errors.push({
            [error.property]: Object.values(error.constraints)[0]
        })
    });
    return {errors, status: "error", message: "Validation Failed"};
}