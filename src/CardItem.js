import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  CardSubtitle,
  ButtonGroup,
} from 'reactstrap';

export default function CardItem({ data, addToCart, removeToCart, left, cart }) {

  const [amount, setAmount] = useState(0)

  useEffect(() => {
    const copyOfCart = [...cart]
    const summary = []

    copyOfCart.forEach((x) => {
      if (summary.length > 0) {
        const findedIndex = summary.findIndex((item) => item.id === x.id)
        if (findedIndex >= 0) {
          summary[findedIndex].amount += 1
        } else {
          const newObj = {
            id: x.id,
            img: x.img,
            title: x.title,
            price: x.price,
            amount: 1
          }
          summary.push(newObj)
        }
      } else {
        const newObj = {
          id: x.id,
          img: x.img,
          title: x.title,
          price: x.price,
          amount: 1
        }
        summary.push(newObj)
      }
    })

    summary.sort((a, b) => {
      return (b.amount * b.price) - (a.amount * a.price)
    })

    summary.forEach((item) => {
      if (item.id === data.id) {
        setAmount(item.amount) 
      }
    })
  }, [])

  const amountReducer = (actionType) => {
    switch (actionType) {
      case "INCREASE":
        if (left >= data.price) {
          addToCart(data)
          setAmount((prev) => prev + 1)
        }
        break;
      case "DECREASE":
        if (amount !== 0) {
          removeToCart(data)
          setAmount((prev) => prev - 1)
        }
        break;
      default:
        break;
    }
  }

  return (
    <Card
      style={{
        width: '400px',
      }}
    >
      <img
        style={{ maxWidth: "400px", maxHeight: "400px" }}
        alt="Product"
        src={data.img}
      />
      <CardBody>
        <CardTitle tag="h4">
          {data.title}
        </CardTitle>
        <CardSubtitle
          className="mb-2 text-muted"
          tag="h3"
        >
          ₺{data.price}
        </CardSubtitle>
        <ButtonGroup style={{ marginTop: "12px" }}>
          <Button disabled={amount <= 0 ? true : false} onClick={() => amountReducer("DECREASE")} color='danger'>
            -
          </Button>
          <h4 style={{ minWidth: "36px", display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding: "0px 12px" }}>{amount}</h4>
          <Button disabled={data.price > left ? true : false} id="buy" onClick={() => amountReducer("INCREASE")} color='primary'>
            +
          </Button>
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}