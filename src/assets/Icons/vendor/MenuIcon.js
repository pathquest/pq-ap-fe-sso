import React from 'react'

export default function MenuIcon(props) {
  return (
    <div>
      <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36' fill='none'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M13 18C13 19.1046 12.1046 20 11 20C9.89543 20 9 19.1046 9 18C9 16.8954 9.89543 16 11 16C12.1046 16 13 16.8954 13 18ZM20 18C20 19.1046 19.1046 20 18 20C16.8955 20 16 19.1046 16 18C16 16.8954 16.8955 16 18 16C19.1046 16 20 16.8954 20 18ZM25 20C26.1046 20 27 19.1046 27 18C27 16.8954 26.1046 16 25 16C23.8954 16 23 16.8954 23 18C23 19.1046 23.8954 20 25 20Z'
          fill={props.fill}
        />
      </svg>
    </div>
  )
}
