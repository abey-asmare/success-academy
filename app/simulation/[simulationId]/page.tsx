import React from "react"

export default async function SimulationDetailPage({params}: {params: Promise<{simulationId: string}>}) {
    const {simulationId} = await params
  return (
    <div>
      {simulationId}
    </div>
  )
}
