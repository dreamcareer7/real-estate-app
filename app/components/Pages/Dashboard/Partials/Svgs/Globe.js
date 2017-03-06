// Draw.js
import React, { Component } from 'react'
export default class Globe extends Component {
  render() {
    return (
      <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Global-viewing-options" transform="translate(-14.000000, -6.000000)">
                <g id="Map" transform="translate(14.000000, 6.000000)">
                    <g id="Group">
                        <g id="Filled_Icons" fill={ this.props.color }>
                            <path d="M21.14,4.236 C20.67,5.568 19.714,7.701 18.224,8.447 C18.117,8.5 17.994,8.513 17.879,8.484 C16.822,8.221 15.752,8.611 15.205,8.923 C15.435,9.232 15.692,9.769 15.938,10.697 C16.151,10.772 16.566,10.659 16.775,10.553 C16.968,10.456 17.2,10.494 17.353,10.647 C18.566,11.86 16.994,13.494 16.054,14.472 C15.888,14.644 15.676,14.864 15.558,15.008 C15.598,15.045 15.645,15.087 15.682,15.118 C15.91,15.317 16.223,15.589 16.239,16.02 C16.249,16.307 16.119,16.587 15.853,16.854 C15.334,17.372 14.811,17.677 14.486,17.835 C14.343,19.535 13.09,20.5 11,20.5 C10.024,20.5 9,18.007 9,17.5 C9,17.132 9.16,16.81 9.303,16.526 C9.399,16.333 9.5,16.132 9.5,16 C9.477,15.829 9.07,15.279 8.646,14.854 C8.553,14.761 8.5,14.633 8.5,14.5 C8.5,14.071 8.423,13.78 8.271,13.637 C8.019,13.4 7.422,13.434 6.793,13.47 C6.534,13.484 6.267,13.5 6,13.5 C4.418,13.5 4,11.865 4,11 C4,10.84 4.033,7.083 6.901,6.51 C8.209,6.248 9.091,6.325 9.604,6.746 C9.785,6.894 9.894,7.068 9.95,7.23 C10.476,7.619 11.42,7.398 12.259,7.204 C12.536,7.139 12.805,7.077 13.054,7.039 C13.147,6.194 13.15,5.376 13.063,5.021 C12.45,5.278 11.841,5.276 11.365,5.012 C10.872,4.738 10.565,4.217 10.503,3.545 C10.369,2.107 13.144,0.989 15.05,0.393 C14.074,0.137 13.053,0 12,0 C5.383,0 0,5.383 0,12 C0,18.617 5.383,24 12,24 C18.616,24 24,18.617 24,12 C24,9.042 22.921,6.332 21.14,4.236 L21.14,4.236 Z" id="Shape"></path>
                        </g>
                        <g id="invisible_shape" transform="translate(1.000000, 0.000000)">
                            <rect id="Rectangle-path" x="0" y="0" width="24" height="24"></rect>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
    )
  }
}
Globe.propTypes = {
  color: React.PropTypes.string
}
