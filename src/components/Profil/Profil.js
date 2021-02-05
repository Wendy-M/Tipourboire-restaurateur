import React, { Component, Input } from "react";
import { Col, Row, Container, Button, Modal } from "react-bootstrap";
import QrCode from "../../assets/components/QRCode/QrCode";
import QrCodeTicket from "../../assets/QRCodeTicket/QRCodeTicket";
import "./profil.css";
import { Redirect } from "react-router-dom";

class Profil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profil: {},
      editing: true,
      show: false,
      redirect: false,
    };
  }
  redirect = () => {
    if (this.state.redirect) {
      localStorage.clear();
      this.props.setLogin(false);
      return <Redirect to="/connexion" />;
    }
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  renderButtonSub = () => {
    if (this.state.profil.abonne === true) {
      return (
        <div>
          <button
            className="signOut button"
            variant="primary"
            onClick={() => {
              this.props.history.push("/dataClient");
            }}
          >
            Espace premium <br />
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button
            className="signOut button"
            variant="primary"
            onClick={() => {
              this.props.history.push("/abonnement");
            }}
          >
            Devenir Premium !<br />
          </button>
        </div>
      );
    }
  };
  buttonEdit = () => {
    if (this.state.editing == true) {
      return (
        <>
          <button
            className="button"
            onClick={() => {
              this.setState({ editing: false });
            }}
          >
            Modifier <br />
          </button>
          {this.renderButtonSub()}
        </>
      );
    } else {
      return (
        <button className="button" onClick={this.putProfilOnClick}>
          Confirmer Modification
        </button>
      );
    }
  };
  buttonCancel = () => {
    if (this.state.editing == false) {
      return (
        <button
          className="button"
          onClick={() => {
            this.setState({ editing: true });
            this.getMonProfil();
          }}
        >
          Annuler
        </button>
      );
    }
  };
  handleInput = (event) => {
    let profil = this.state.profil;
    profil[event.target.name] = event.target.value;
    this.setState({
      profil: profil,
      // identifier name de l'input = choisir la valeur qui se trouve dans l'input
    });
  };
  /* Affichage Profil */
  getMonProfil = () => {
    const headers = new Headers({
      Authorization: "Bearer " + localStorage.getItem("token"),

      "X-Requested-With": "XMLHttpRequest",
    });

    const options = {
      method: "GET",
      headers: headers,
    };

    fetch("https://back-end.osc-fr1.scalingo.io/restaurateur/profil", options)
      .then((response) => {
        return response.json();
      })
      .then(
        (responseObject) => {
          const monProfil = responseObject;
          this.setState({ profil: monProfil });
          console.log(this.state);
        },

        (error) => {
          console.log(error);
        }
      );
  };
  unSubscription = () => {
    const headers = new Headers({
      Authorization: "Bearer " + localStorage.getItem("token"),
    });

    const options = {
      method: "POST",
      headers: headers,
    };

    fetch("https://back-end.osc-fr1.scalingo.io/restaurateur/delete", options)
      .then((response) => {
        return response.json();
      })
      .then(
        (responseObject) => {
          this.setState({ profil: responseObject });
        },

        (error) => {
          console.log(error);
        }
      );
  };

  /* Modification du profil */
  modifProfil = () => {
    const data = {
      restaurantName: this.state.profil.restaurantName,
      bossName: this.state.profil.bossName,
      adress: this.state.profil.adress,
      email: this.state.profil.email,
      bossFirstName: this.state.profil.bossFirstName,
      phone: this.state.profil.phone,
    };

    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });

    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: headers,
    };

    fetch("https://back-end.osc-fr1.scalingo.io/restaurateur/profil/edit", options)
      .then((response) => {
        return response.json();
      })

      .then(
        (responseObject) => {
          this.setState({ message: responseObject.message });
          this.setState({ editing: true });
        },

        (error) => {
          console.log(error);
        }
      );
  };

  /* Modification du logo */
  modifProfilLogo = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const headers = new Headers({
      "X-Requested-With": "XMLHttpRequest",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });

    const options = {
      method: "PUT",
      body: data,
      headers: headers,
    };

    fetch("https://back-end.osc-fr1.scalingo.io/restaurateur/profil/edit/logo", options)
      .then((response) => {
        return response.json();
      })

      .then(
        (responseObject) => {
          this.setState({ message: responseObject.message });
          this.getMonProfil();
        },

        (error) => {
          console.log(error);
        }
      );
  };

  putProfilOnClick = () => {
    this.modifProfil();
  };

  componentDidMount() {
    this.getMonProfil();
  }

  render() {
    return (
      <Container className="styleProfil ">
        <h2 className="title">Votre Profil</h2>

        <Col className="addImage ">
          <form onSubmit={this.modifProfilLogo} className="formLogo">
            <img
              className="restaurantLogo"
              src={"https://back-end.osc-fr1.scalingo.io/" + this.state.profil.logo}
            ></img>
            <br />
            <br />
            <input type="file" name="file" />
            <br />
            <button className="buttonVal" type="submit">
              Valider
            </button>
          </form>
        </Col>
        <Row>
          {" "}
          <Col md={12} className="formProfil ">
            <p>
              {this.state.editing ? (
                <h1 className="textProfilTitre">
                  {this.state.profil.restaurantName}
                </h1>
              ) : (
                <input
                  type="text"
                  Value={this.state.profil.restaurantName}
                  name="restaurantName"
                  onChange={this.handleInput}
                />
              )}
            </p>
            <p>
              {this.state.editing ? (
                <span className="textProfil">
                  {this.state.profil.bossFirstName}
                </span>
              ) : (
                <input
                  type="text"
                  name="bossFirstName"
                  onChange={this.handleInput}
                  Value={this.state.profil.bossFirstName}
                />
              )}
            </p>
            <p>
              {this.state.editing ? (
                <span className="textProfil">{this.state.profil.bossName}</span>
              ) : (
                <input
                  type="text"
                  name="bossName"
                  onChange={this.handleInput}
                  Value={this.state.profil.bossName}
                />
              )}
            </p>
            <p>
              {this.state.editing ? (
                <span className="textProfil">{this.state.profil.adress}</span>
              ) : (
                <input
                  type="text"
                  name="adress"
                  onChange={this.handleInput}
                  Value={this.state.profil.adress}
                />
              )}
            </p>
            <p>
              {this.state.editing ? (
                <span className="textProfil">{this.state.profil.email}</span>
              ) : (
                <input
                  type="text"
                  name="email"
                  onChange={this.handleInput}
                  Value={this.state.profil.email}
                />
              )}
            </p>
            <p>
              {this.state.editing ? (
                <span className="textProfil">{this.state.profil.phone}</span>
              ) : (
                <input
                  type="text"
                  Value={this.state.profil.phone}
                  name="phone"
                  onChange={this.handleInput}
                />
              )}
            </p>
            {this.buttonEdit()}

            {this.buttonCancel()}
          </Col>
          <Col md={12} className="formProfil nomProfil center">
            <p className="qr">QR CODE Ticket </p>
            <QrCodeTicket
              className="qrCodeTicket"
              restaurantName={this.state.profil.restaurantName}
            />

            <p className="qr">QR CODE </p>
            <QrCode
              className="qrCode"
              restaurantName={this.state.profil.restaurantName}
            />
            <Button
              onClick={() => {
                window.confirm("Voulez vous vous déconnecter ?");
                localStorage.clear();
                this.props.setLogin(false);
                this.props.history.push("/");
              }}
              className="signOut1 button"
            >
              Déconnexion
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Profil;
