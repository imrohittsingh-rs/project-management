"use client"

const AvatarCircles = ({
  numPeople = 0,
  className = "",
  avatarUrls = [],
}) => {
  return (
    <div className={`z-10 flex -space-x-3 rtl:space-x-reverse ${className}`}>
      {avatarUrls.map((url, index) => (
        <img
          key={url}
          className="h-10 w-10 rounded-full border-2 border-white object-cover"
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {numPeople > 0 && (
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#171717] text-center text-xs font-medium text-white"
          aria-label={`${numPeople} more people`}
        >
          +{numPeople}
        </span>
      )}
    </div>
  )
}

export { AvatarCircles }