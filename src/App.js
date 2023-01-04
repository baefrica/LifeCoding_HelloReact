import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

// Header
function Header(props) {
  return (
    <header>
      <img src={ logo } className="App-logo" alt="logo" />
      <h2>Hello <a href="/" onClick={ function(event) {
        event.preventDefault();   // 클릭해도 리로드가 되지 않도록 하기 위함
        props.onChangeMode();
      }}>{ props.title }</a> App</h2>
      <p>2022 카타르 월드컵 대표팀 명단</p>
    </header>
  )
}

// Nav
function Nav(props) {
  const list = [];

  for(let i = 0; i < props.member.length; i++) {
    let m = props.member[i];
    list.push(<li key={ m.id }>
      <a
       id={ m.id } href={ '/read/' + m.id } onClick={ event => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));  // 숫자로 입력했지만, 태그의 속성으로 끌고오면 문자열이 됨 -> 숫자형으로 변환
       }}
      >
        { m.name }
      </a></li>);
  }

  return (
    <nav>
      <ol>
        { list }
      </ol>
    </nav>
  )
}

// Article
function Article(props) {
  return (
    <div>
      <h2>{ props.title }</h2>
      { props.body }
    </div>
  )
}

// Create
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={ event => {
        event.preventDefault();
        
        const title = event.target.name.value;
        const body = event.target.pos.value;
        
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="name" placeholder="이름 입력"/></p>
        <p><input type="text" name="pos" placeholder="포지션 입력"/></p>
        <p><input id = "create_btn" type="submit" value="생성"/></p>
      </form>
    </article>
  )
}

// Update
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={ event => {
        event.preventDefault();
        
        const title = event.target.name.value;
        const body = event.target.pos.value;
        
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="name" placeholder="이름 수정" value={ title } onChange={ event => {
          setTitle(event.target.value);
        }}/></p>
        <p><input type="text" name="pos" placeholder="포지션 수정" value={ body } onChange={ event => {
          setBody(event.target.value);
        }}/></p>
        <p><input id = "create_btn" type="submit" value="수정"/></p>
      </form>
    </article>
  )
}

function App() {
  /*
  const _mode = useState('WELCOME');
  const mode = mode[0];
  const setMode = mode[1];
  */
  const[mode, setMode] = useState('WELCOME');
  const[id, setId] = useState(null);
  const[nextId, setNextId] = useState(10);

  const [players, setPlayer] = useState([
    {id:1, name:'김승규', pos:'GK'},
    {id:2, name:'김문환', pos:'DF'},
    {id:3, name:'김민재', pos:'DF'},
    {id:4, name:'김영광', pos:'DF'},
    {id:5, name:'김진수', pos:'DF'},
    {id:6, name:'정우영', pos:'MF'},
    {id:7, name:'황인범', pos:'MF'},
    {id:8, name:'이재성', pos:'MF'},
    {id:9, name:'황희찬', pos:'MF'},
  ]);

  let content = null;
  let contextControl = null;

  if(mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, React"></Article>;
  }
  else if(mode === 'READ') {
    let title, body = null;
    // state 의 id 와 같다면
    for(let i = 0; i < players.length; i++) {
      if(players[i].id === id) {
        title = players[i].name;
        body = players[i].pos;
      }
    }

    content = <Article title={ title } body={ body }></Article>

    contextControl = <>
      <li><button href={ "/update/" + id } onClick={ event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</button></li>
      <li><button value="Delete" onClick={ event => {
        const newPlayers = [];

        for(let i = 0; i < players.length; i++) {
          if(players[i].id !== id) {
            newPlayers.push(players[i]);
          }
        }

        setPlayer(newPlayers);
        setMode("WELCOME");
      }}>Delete</button></li>
    </>
  }
  else if(mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      const newPlayer = {id:nextId, name:title, pos:body};
      const newPlayers = [...players];
      newPlayers.push(newPlayer);
      setPlayer(newPlayers);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if(mode === 'UPDATE') {
    let title, body = null;
    // state 의 id 와 같다면
    for(let i = 0; i < players.length; i++) {
      if(players[i].id === id) {
        title = players[i].name;
        body = players[i].pos;
      }
    }

    content = <Update title={ title } body={ body } onUpdate={(title, body) => {
      const updatedPlayer = {id:id, name:title, pos:body};
      const newPlayers = [...players];
      
      for(let i = 0; i < newPlayers.length; i++) {
        if(newPlayers[i].id === id) {
          newPlayers[i] = updatedPlayer;
          break;
        }
      }
      
      setPlayer(newPlayers);
      setMode('READ');
    }}></Update>
  }
  else if(mode === 'DELETE') {
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4
  }

  return (
    <div className="App">
      <Header title="REACT" onChangeMode={ () => {
        setMode('WELCOME');
      }}></Header>
      <Nav member={ players } onChangeMode={ (id) => {
        setMode('READ');
        setId(id);
      }}></Nav>
      { content }
      <ul>
        <li><button href="/create" onClick={ event => {
          event.preventDefault();
          setMode('CREATE');
        }}>Create</button></li>
        { contextControl }
      </ul>
    </div>
  );
}

export default App;