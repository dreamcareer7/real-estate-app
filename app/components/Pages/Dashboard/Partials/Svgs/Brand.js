// / Brand.js

import React from 'react'
export default ({
                  color = '#4E5C6C',
                  width = 24,
                  height = 21
                }) => (
                  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 21">
                    <g fill="none" fillRule="evenodd">
                      <g fill={color} fillRule="nonzero">
                        <path d="M5.109 4l.998-4H2.5a.498.498 0 0 0-.447.276L.19 4h4.919zM11 4l-.003-4H7.139L6.14 4zM16.857 0H12l.003 4h5.856zM18.891 4h4.919L21.948.276A.5.5 0 0 0 21.5 0h-3.611l1.002 4zM17.999 5h-5.996L12 9.217c1 .676 3.776 1.51 5.995-.394L17.999 5zM4.999 5H0v.5c0 2.623 2.871 4.367 4.996 3.047L4.999 5zM19 5v3.546c2.106 1.32 5-.404 5-3.046V5h-5zM11 5H6v3.816c1.497 1.29 3.194 1.62 5 .408V5z" />
                        <g transform="translate(2 9)">
                          <circle cx="15.5" cy="7.5" r="1" />
                          <path d="M16.711.54c-2.406 2.131-5.678 1.564-7.208.566-2.239 1.461-4.49.96-6.214-.566-.977.527-2.069.619-3.289.183V11.5a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5V.723c-1.136.406-2.24.383-3.289-.183zM10 7.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v4zm7 3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v7z" />
                        </g>
                      </g>
                      <path d="M0-2h24v24H0z" />
                    </g>
                  </svg>
)