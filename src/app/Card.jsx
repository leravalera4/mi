import React from 'react'
import SlidingPane from 'react-sliding-pane'
import basket from './images/icon.png'
import Image from 'next/image.js'
import localFont from 'next/font/local'

const Card = ({cartData}) => {
  const [state, setState] = React.useState({
    isPaneOpen: false,
    isPaneOpenLeft: false
  })


  const noir = localFont({
    src: [
      {
        path: './fonts/NoirPro-Light.ttf',
        weight: '200',
        style: 'normal',
      },
      {
        path: './fonts/NoirPro-Regular.ttf',
        weight: '400',
        style: 'normal',
      },
      {
        path: './fonts/NoirPro-Bold.ttf',
        weight: '700',
        style: 'normal',
      },
    ],
  });

  return (
    <div>
    {cartData.length != 0 && (
        <div
          style={{
            position: 'sticky',
            rigth: '50',
            bottom: '0',
            float: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Image
            alt='shopping'
            src={basket}
            width={120}
            height={120}
            onClick={() => setState({ isPaneOpen: true })}
          />
          <button
            className={noir.className}
            style={{
              outline: '0',
              cursor: 'pointer',
              padding: '5px 16px',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '20px',
              verticalAlign: 'middle',
              border: '1px solid',
              borderRadius: ' 6px',
              color: ' #24292e',
              backgroundColor: '#fafbfc',
              borderColor: '#1b1f2326',
              boxShadow:
                'rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset',
              transition: '0.2s cubic-bezier(0.3, 0, 0.5, 1)',
            }}
            onClick={() => setState({ isPaneOpen: true })}
          >
            Show Cart
          </button>
          <div
            style={{
              height: '40px',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
            }}
          ></div>
        </div>
      )}
      <SlidingPane
      style={{position:'absolute',zIndex:'10000'}}
        className={noir.className}
        overlayClassName={noir.className}
        isOpen={state.isPaneOpen}
        title='Cart'
        onRequestClose={() => {
          setState({ isPaneOpen: false })
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            opacity: '100',
            transition: 'all .75s ease'
          }}
        >
          {cartData.map((store, storeIndex) => (
            <div style={{ marginRight: '32px' }} key={storeIndex}>
              <h3>{store.storeName}</h3>
              <ol>
                {store.items.map((item, itemIndex) => (
                  <>
                    <li key={itemIndex}>
                      {item.title + ' ' + '$' + item.regprice}
                    </li>
                  </>
                ))}
              </ol>
              <p>
                <b>Total price:</b> {store.sum}
              </p>
            </div>
          ))}
        </div>
      </SlidingPane>
    </div>
  )
}

export default Card;