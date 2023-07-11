import React, { useState, useEffect } from 'react'
import {
  Navbar,
  NavbarBrand,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Container,
  Card,
  CardText,
  CardTitle,
  Row,
  Col,
  Table
} from 'reactstrap';
import CardItem from './CardItem';
import data from "./data"

export default function App() {

  const [savings, setSavings] = useState("");
  const [months, setMonths] = useState("");
  const [stage, setStage] = useState(1);

  const [totalSavings, setTotalSavings] = useState(0)
  const [totalSpendings, setTotalSpendings] = useState(0)
  const [left, setLeft] = useState(0)

  const [cart, setCart] = useState([])

  useEffect(() => {
  }, [cart])

  const addToCart = (item) => {
    if (left >= item.price) {
      setCart((prev) => [...prev, item])
      setTotalSpendings((prev) => Number(prev) + Number(item.price))
      setLeft((prev) => Number(prev) - Number(item.price))
    }
  }

  const removeToCart = (item) => {
    const copyOfCart = [...cart]
    copyOfCart.splice(copyOfCart.findIndex(e => e.id === item.id), 1)
    setCart(copyOfCart)
    setTotalSpendings((prev) => Number(prev) - Number(item.price))
    setLeft((prev) => Number(prev) + Number(item.price))
  }

  const calculateSavings = () => {
    setTotalSavings(savings * months)
    setLeft(savings * months)
    setStage(2)
  }

  const generateSummary = () => {
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


    // summaryi amount * price büyük olandan küçük olana göre sırala
    
    summary.sort((a, b) => {
      return (b.amount * b.price) - (a.amount * a.price) 
    })

    return (
      <>
        {
          summary.map((item, index) => (
            <tr key={index}>
              <th scope="row">
                {index + 1}
              </th>
              <td>
                <img src={item.img} width={100} height={100} alt=''/>
              </td>
              <td>
                {item.title}
              </td>
              <td>
              ₺{item.price}
              </td>
              <td>
                {item.amount}
              </td>
              <td>
              ₺{Number(item.price) * Number(item.amount)}
              </td>
            </tr>
          ))
        }
        {
          <tr >
            <th scope="row">
              
            </th>
            <td>
              Toplam
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
            </td>
            <td>
            ₺{ totalSpendings }
            </td>
          </tr>
        }
      </>
    )
  }

  return (
    <div>
      <Navbar style={{ padding: "12px" , position: "fixed", top:"0",  width: "100%", zIndex:"9999"}}>
        <NavbarBrand style={{ fontWeight: "500", letterSpacing: "0.2px", backgroundColor:""}} href="/">Birikimini Harca</NavbarBrand>
        {
          stage === 2 && <Button onClick={() => setStage(3)} disabled={totalSpendings > 0 ? false : true} color="primary">
            Harcama Özeti
          </Button>
        }
        {
          stage === 3 && <Button onClick={() => setStage(2)} disabled={totalSpendings > 0 ? false : true} color="primary">
            Harcamaya Devam Et
          </Button>
        }
      </Navbar>
      {
        stage === 1
          ? <Container>
            <Card style={{ padding: "24px", margin: "12px" }}>
              <Form>
                <FormGroup>
                  <Label for="savings">
                    Aylık Biriktirdiğiniz Miktar
                  </Label>
                  <Input
                    id="savings"
                    name="savings"
                    type="number"
                    value={savings}
                    onChange={(e) => setSavings(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="months">
                    Kaç Aylık Birikiminizi Harcamak İstersiniz?
                  </Label>
                  <Input
                    id="months"
                    name="months"
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                  />
                </FormGroup>
                <Button style={{ marginTop: "12px" }} disabled={(savings && months) ? false : true} onClick={() => {
                  calculateSavings()
                }} color="primary">
                  Hesapla
                </Button>
              </Form>
            </Card>
          </Container>
          : stage === 2
            ? <>
              <Container >
                <Card style={{ padding: "24px", margin: "12px"}}>
                  <Row >
                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <CardTitle style={{ color: "#6c757d" }} tag={'h5'}>Birikim</CardTitle>
                      <CardText tag={'h1'}>
                        ₺{totalSavings}
                      </CardText>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <CardTitle style={{ color: "#6c757d" }} tag={'h5'}>Harcanan</CardTitle>
                      <CardText tag={'h1'}>
                        ₺{totalSpendings}
                      </CardText>
                    </Col>
                    <Col style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <CardTitle style={{ color: "#6c757d" }} tag={'h5'}>Kalan</CardTitle>
                      <CardText tag={'h1'}>
                        ₺{left}
                      </CardText>
                    </Col>
                  </Row>
                </Card>
              </Container>

              <Container fluid style={{ marginTop: "24px", marginBottom: "32px" }}>
                <Card style={{ padding: "24px", margin: "12px", display: "flex", flexDirection: "row", flexWrap: "wrap", columnGap: "48px", rowGap: "48px", justifyContent: "space-evenly" }}>
                  {
                    data.map((item) => (
                      <CardItem key={item.id} data={item} addToCart={addToCart} removeToCart={removeToCart} left={left} cart={cart} />
                    ))
                  }
                </Card>
              </Container>
            </>
            : <Container>
              <Card style={{ padding: "24px", margin: "12px" }}>
                <Row>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>
                          #
                        </th>
                        <th>
                          Resim
                        </th>
                        <th>
                          Ürün
                        </th>
                        <th>
                          Fiyat
                        </th>
                        <th>
                          Adet
                        </th>
                        <th>
                          Toplam
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        generateSummary()
                      }
                    </tbody>
                  </Table>
                </Row>
              </Card>
            </Container>
      }
    </div>
  )
}
