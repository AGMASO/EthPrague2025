"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield, Zap } from "lucide-react"

export default function FeatureCards() {
  const features = [
    {
      icon: TrendingUp,
      title: "Transaktionsanalyse",
      description: "Detaillierte Analyse von Transaktionsmustern, Volumen und Häufigkeit",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Shield,
      title: "Risikobewertung",
      description: "AI-gestützte Bewertung von Sicherheitsrisiken und verdächtigen Aktivitäten",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Zap,
      title: "Echtzeit-Insights",
      description: "Sofortige Ergebnisse mit maschinellem Lernen und Blockchain-Datenanalyse",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {features.map((feature, index) => (
        <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
