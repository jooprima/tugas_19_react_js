import React, {Component} from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Container,
  Menu,
  Dropdown,
  Image,
  Header,
  Form,
  Button,
  Card
} from "semantic-ui-react";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      edit: false,
      dataPost: {
        id: 0,
        nama: "",
        jabatan: "",
        jenisKelamin: "",
        tanggalLahir: ""
      }
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  reloadData() {
    axios.get("http://localhost:3004/posts").then(res => {
      this.setState({
        dataApi: res.data,
        edit: false
      });
    });
  }

  handleRemove(e) {
    console.log(e.target.value);
    fetch(`http://localhost:3004/posts/${e.target.value}`, {
      method: "DELETE"
    }).then(res => this.reloadData());
  }

  inputChange(e) {
    let newdataPost = {...this.state.dataPost};

    if (this.state.edit === false) {
      newdataPost["id"] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;

    this.setState(
      {
        dataPost: newdataPost
      },
      () => console.log(this.state.dataPost)
    );
  }

  onSubmitForm() {
    if (this.state.edit === false) {
      axios
        .post(`http://localhost:3004/posts`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        });
    } else {
      axios
        .put(
          `http://localhost:3004/posts/${this.state.dataPost.id}`,
          this.state.dataPost
        )
        .then(() => {
          this.reloadData();
          this.clearData();
        });
    }
  }

  clearData = () => {
    let newdataPost = {...this.state.dataPost};

    newdataPost["id"] = "";
    newdataPost["nama"] = "";
    newdataPost["jabatan"] = "";
    newdataPost["jenisKelamin"] = "";
    newdataPost["tanggalLahir"] = "";

    this.setState({
      dataPost: newdataPost
    });
  };

  getDataId = e => {
    axios.get(`http://localhost:3004/posts/${e.target.value}`).then(res => {
      this.setState({
        dataPost: res.data,
        edit: true
      });
    });
  };

  componentDidMount() {
    // fetch('https://jsonplaceholder.typicode.com/posts')
    // .then(response => response.json())
    // .then(res => {
    //   this.setState({
    //     dataApi:res
    //   })
    // });
    this.reloadData();
  }

  render() {
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image
                size="mini"
                src="https://s3-ap-southeast-1.amazonaws.com/niomic/img-v1/c_login_logo.png"
              />
              Niomic
            </Menu.Item>

            <Menu.Item as="a">Home</Menu.Item>

            <Dropdown item simple text="Data">
              <Dropdown.Menu>
                <Dropdown.Item>Data Karyawan</Dropdown.Item>
                <Dropdown.Item>Data Pelajar</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Menu>

        <Container text style={{marginTop: "7em"}}>
          <Header as="h1">Data Karyawan</Header>

          <br />

          <Form>
            <Form.Field>
              <label>Nama</label>
              <input
                placeholder="Masukan Nama Karyawan"
                name="nama"
                value={this.state.dataPost.nama}
                onChange={this.inputChange}
              />
            </Form.Field>

            <Form.Field>
              <label>Jabatan</label>
              <input
                placeholder="Masukan Jabatan"
                name="jabatan"
                value={this.state.dataPost.jabatan}
                onChange={this.inputChange}
              />
            </Form.Field>

            <Form.Field>
              <label>Jenis Kelamin</label>
              <input
                placeholder="Masukan Jenis Kelamin"
                name="jenisKelamin"
                value={this.state.dataPost.jenisKelamin}
                onChange={this.inputChange}
              />
            </Form.Field>

            <Form.Field>
              <label>Tanggal Lahir</label>
              <input
                placeholder="Masukan Tanggal Lahir"
                name="tanggalLahir"
                value={this.state.dataPost.tanggalLahir}
                onChange={this.inputChange}
              />
            </Form.Field>

            <Button type="submit" onClick={this.onSubmitForm}>
              Save Data
            </Button>
          </Form>

          <br />

          {this.state.dataApi.map((dat, index) => {
            return (
              <div key={index}>
                <br />

                  <Card>
                    <Card.Content >
                      <Card.Header>Data Karyawan</Card.Header>
                      <Card.Description>
                        <p>Nama : {dat.nama}</p>
                        <p>Jabatan : {dat.jabatan}</p>
                        <p>Jenis Kelamin : {dat.jenisKelamin}</p>
                        <p>Tanggal lahir : {dat.tanggalLahir}</p>
                      </Card.Description>
                    </Card.Content>

                    <Card.Content>
                      <div className="ui two buttons">
                        <Button
                          color="red"
                          value={dat.id}
                          onClick={this.handleRemove}
                        >
                          Delete
                        </Button>
                        <Button
                          color="green"
                          value={dat.id}
                          onClick={this.getDataId}
                        >
                          Edit Data
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>

              </div>
            );
          })}
        </Container>

        <br />

      </div>
    );
  }
}

export default App;
