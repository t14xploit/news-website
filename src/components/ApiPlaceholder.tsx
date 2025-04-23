import Image from "next/image"; 

export default function ApiPlaceholder() {
  return (

     
      <div className="flex justify-between items-center py-6 px-4 bg-gray-100 rounded-lg shadow-lg">
  {/* Left Image */}
  <Image 
    src="/RealWeather.svg"
    alt="weather-placeholder"
    width={300}
    height={300}
    className="rounded-md shadow-md"
  />

  {/* Center Content (Stock Prices or Ticker) */}
  <div className="flex flex-col items-center justify-center px-4 text-center">
    <div className="text-lg font-semibold text-gray-700 mb-2">Stock Market Ticker</div>
    
    {/* Simulating dynamic stock data */}
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span className="font-medium text-blue-600">AAPL (Apple)</span>
        <span className="text-green-500">+2.34%</span>
        <span className="font-bold text-gray-800">$145.23</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-blue-600">GOOGL (Google)</span>
        <span className="text-red-500">-1.15%</span>
        <span className="font-bold text-gray-800">$2800.45</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium text-blue-600">AMZN (Amazon)</span>
        <span className="text-green-500">+0.65%</span>
        <span className="font-bold text-gray-800">$3500.12</span>
      </div>
    </div>
  </div>

  {/* Right Image */}
  <Image 
    src="/BarLineChart.svg"
    alt="barline-placeholder"
    width={500}
    height={500}
    className="rounded-md shadow-md"
  />
</div>  )
}
