export const mdiPinterestPath =
  'M12 2C6.47718 2 2 6.47718 2 12C2 16.2365 4.63583 19.8581 8.35575 21.3152C8.26836 20.524 8.18934 19.3072 8.39042 18.4435C8.57215 17.663 9.56304 13.4728 9.56304 13.4728C9.56304 13.4728 9.26392 12.8737 9.26392 11.9881C9.26392 10.5976 10.0699 9.55951 11.0734 9.55951C11.9266 9.55951 12.3386 10.2 12.3386 10.9681C12.3386 11.8261 11.7924 13.1089 11.5105 14.2977C11.2749 15.293 12.0096 16.1047 12.9913 16.1047C14.7686 16.1047 16.1349 14.2306 16.1349 11.5255C16.1349 9.13112 14.4144 7.45708 11.9578 7.45708C9.11243 7.45708 7.44232 9.59124 7.44232 11.7968C7.44232 12.6563 7.77341 13.5779 8.18655 14.0789C8.26828 14.1779 8.28025 14.2647 8.2559 14.3657C8.18 14.6816 8.0113 15.3608 7.97818 15.4998C7.93457 15.6829 7.83325 15.7217 7.64373 15.6335C6.3948 15.0522 5.61393 13.2261 5.61393 11.7595C5.61393 8.60502 7.90588 5.70803 12.2213 5.70803C15.6903 5.70803 18.3862 8.18 18.3862 11.4836C18.3862 14.9299 16.2131 17.7036 13.197 17.7036C12.1837 17.7036 11.2311 17.1771 10.905 16.5553C10.905 16.5553 10.4036 18.4646 10.282 18.9325C10.0563 19.8011 9.4468 20.8898 9.03915 21.5541C9.97479 21.8438 10.9691 22 12 22C17.5229 22 22.0001 17.5228 22.0001 12C22.0001 6.47718 17.5229 2 12 2Z'

function Pinterest(props) {
  const { width = 24, height = 24, color = "#333" } = props

  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
    >
      <path d="M12 2C6.47718 2 2 6.47718 2 12C2 16.2365 4.63583 19.8581 8.35575 21.3152C8.26836 20.524 8.18934 19.3072 8.39042 18.4435C8.57215 17.663 9.56304 13.4728 9.56304 13.4728C9.56304 13.4728 9.26392 12.8737 9.26392 11.9881C9.26392 10.5976 10.0699 9.55951 11.0734 9.55951C11.9266 9.55951 12.3386 10.2 12.3386 10.9681C12.3386 11.8261 11.7924 13.1089 11.5105 14.2977C11.2749 15.293 12.0096 16.1047 12.9913 16.1047C14.7686 16.1047 16.1349 14.2306 16.1349 11.5255C16.1349 9.13112 14.4144 7.45708 11.9578 7.45708C9.11243 7.45708 7.44232 9.59124 7.44232 11.7968C7.44232 12.6563 7.77341 13.5779 8.18655 14.0789C8.26828 14.1779 8.28025 14.2647 8.2559 14.3657C8.18 14.6816 8.0113 15.3608 7.97818 15.4998C7.93457 15.6829 7.83325 15.7217 7.64373 15.6335C6.3948 15.0522 5.61393 13.2261 5.61393 11.7595C5.61393 8.60502 7.90588 5.70803 12.2213 5.70803C15.6903 5.70803 18.3862 8.18 18.3862 11.4836C18.3862 14.9299 16.2131 17.7036 13.197 17.7036C12.1837 17.7036 11.2311 17.1771 10.905 16.5553C10.905 16.5553 10.4036 18.4646 10.282 18.9325C10.0563 19.8011 9.4468 20.8898 9.03915 21.5541C9.97479 21.8438 10.9691 22 12 22C17.5229 22 22.0001 17.5228 22.0001 12C22.0001 6.47718 17.5229 2 12 2Z" />
    </svg>
  )
}

export default Pinterest