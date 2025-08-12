interface Contract {
  type: string
  minCommitment: string
  noticePeriod: string
  securityDeposit: string
  entryFees: string
  ubiqFees: string
}

interface OfficeContractProps {
  contract: Contract
}

export function OfficeContract({ contract }: OfficeContractProps) {
  const contractItems = [
    { label: 'Type de contrat', value: contract.type },
    { label: 'Engagement minimum', value: contract.minCommitment },
    { label: 'Durée de préavis', value: contract.noticePeriod },
    { label: 'Dépôt de garantie', value: contract.securityDeposit },
    { label: 'Frais d\'entrée HT', value: contract.entryFees },
    { label: 'Honoraires Ubiq', value: contract.ubiqFees }
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contrat et conditions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contractItems.map((item, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
