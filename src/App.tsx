import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import * as React from "react";
import {useState} from "react";
import {AlertCircle, CheckCircle2, Loader2} from "lucide-react";
import {BankModel} from "@/models/bankModel";
import {ResultModel} from "@/models/resultModel";

export function App() {
    const [iban, setIban] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ResultModel>({ status: null })

    const formatIban = (value: string) => {
        const cleaned  = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
        return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned
    }

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!iban.trim()) {
            setResult({
                status: "error",
                message: "Please enter an IBAN",
            })
            return
        }

        setLoading(true)
        setResult({ status: null })

        // @ts-ignore
        const API_URL = import.meta.env.VITE_IBAN_API_URL as string;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ iban: iban.toUpperCase() }),
            });

            if (response.ok) {
                const data: BankModel = await response.json();
                setResult({
                    status: "success",
                    bankName: data.name,
                    bic: data.bic,
                    message: `${data.name} BIC: ${data.bic}`,
                });
                return;
            }

            if (response.status === 400) {
                setResult({
                    status: "error",
                    message: "Invalid IBAN format or non-existent bank",
                });
            } else {
                setResult({
                    status: "error",
                    message: "Error validating IBAN. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error validating IBAN:", error);
            setResult({
                status: "error",
                message: "Error validating IBAN. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }


    return (
        <Card className="w-full max-w-md glass-effect glow-accent border-accent/30 relative overflow-hidden group">
            <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">IBAN Validator</CardTitle>
                <CardDescription>
                    Verify your international bank account number
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleValidate} className="space-y-4">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="iban" className="text-sm font-medium text-accent/90 uppercase tracking-wider">IBAN</Label>
                            <Input
                                id="iban"
                                value={iban}
                                onChange={(e) => setIban(formatIban(e.target.value))}
                                disabled={loading}
                                placeholder="DE89 3704 0044 0532 0130 00"
                                className="text-base font-mono tracking-widest bg-input/50 border-accent/50 text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:ring-accent/50 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-accent-foreground font-semibold py-2 h-10 glow-neon transition-all duration-300 uppercase tracking-wider">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Validating...
                            </>
                        ) : (
                            "Validate IBAN"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                {result.status && (
                    <div
                        className={`p-4 rounded-lg flex items-start gap-3 animate-in fade-in-50 duration-300 glass-effect transition-all w-full ${
                            result.status === "success"
                                ? "border-green-500/50 bg-green-500/10"
                                : "border-destructive/50 bg-destructive/10"
                        }`}
                    >
                        {result.status === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5 animate-pulse" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5 animate-pulse" />
                        )}
                        <div className="flex-1 space-y-1">
                            <p
                                className={`text-sm font-medium ${
                                    result.status === "success" ? "text-green-300" : "text-destructive/90"
                                }`}
                            >
                                {result.status === "success" ? "Valid IBAN" : "Invalid IBAN"}
                            </p>
                            <p className={`text-sm ${result.status === "success" ? "text-green-200/80" : "text-destructive/70"}`}>
                                {result.message}
                            </p>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}


export default App
