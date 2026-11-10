const Loadingspinner = ({ className = 'min-h-[70vh] w-full' }) => (
  <div
    className={`flex items-center justify-center text-[#171717] ${className}`}
    role="status"
    aria-label="Loading"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="4" cy="12" r="2" fill="currentColor">
        <animate
          id="loading-dot-one"
          begin="0;loading-dot-three.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="2" fill="currentColor">
        <animate
          begin="loading-dot-one.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor">
        <animate
          id="loading-dot-three"
          begin="loading-dot-one.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  </div>
)

export { Loadingspinner as Loader }
export default Loadingspinner
