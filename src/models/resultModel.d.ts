export type ResultModel = {
    status: "success" | "error" | null
    bankName?: string
    bic?: string
    message?: string
}
