import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const loadLinks = async() => {
    try {
      const res = await fetch('/api/getLinks');
      const links = await res.json();
      setLinks(links);
    } catch(err) {
      console.log(err);
    }
  }

  // @HACK
  const refreshLinks = () => { loadLinks() };

  const resetForm = () => {
    setName('');
    setUrl('');
    setDescription('');
  }

  const archiveLink = async (link) => {
    link.archived = true;
    try {
      await fetch('/api/updateLink', {
        method: 'PUT',
        body: JSON.stringify(link)
      });
      refreshLinks();
    } catch(err) {
      console.log(err);
    }
  }

  const deleteLink = async (linkId) => {
    const id = linkId;
    try {
      await fetch('/api/deleteLink', {
        method: 'DELETE',
        body: JSON.stringify({id})
      });
      refreshLinks();
    } catch(err) {
      console.log(err);
    }
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const body = { name, url, description };
    try {
      const res = await fetch('/api/createLink', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      console.log(res);
      resetForm();
      refreshLinks();
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  const currentLinks = links && links.filter(link => !link.archived);
  const archivedLinks = links && links.filter(link => link.archived);

  return (
    <div className="App">
      <h1>List o' Links</h1>
      <form className="add-link" onSubmit={(ev) => { handleSubmit(ev); }}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(ev) => { setName(ev.target.value)}}
        />
        <label htmlFor="description">Description</label>
        <input 
          id="description"
          type="text"
          name="description"
          value={description}
          onChange={(ev) => { setDescription(ev.target.value)}}
        />
        <label htmlFor="url">Url</label>
        <input 
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={(ev) => { setUrl(ev.target.value)}}
        />
        <input type="submit" value="submit url" />
      </form>
      {currentLinks.length > 0 &&
        <ul>
          {currentLinks.map(link => {
            return (
              <li key={`link-${link._id}`}>
                <div className="link-info">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                  <p>{link.description}</p>
                </div>
                <div className="button-wrapper">
                  <button className="archive" onClick={() => { archiveLink(link); }}>Archive</button>
                  <button className="delete" onClick={() => { deleteLink(link._id); }}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      }
      {archivedLinks.length > 0 &&
        <React.Fragment>
          <h2>Archived Links</h2>
          <ul>
            {archivedLinks.map(al => {
              return (
                <li key={`archived-link-${al._id}`}>
                  <div className="link-info">
                    <a href={al.url} target="_blank" rel="noopener noreferrer">{al.name}</a>
                    <p>{al.description}</p>
                  </div>
                  <div className="button-wrapper">
                    <button className="delete" onClick={() => { deleteLink(al._id); }}>Delete</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </React.Fragment>
      }
    </div>
  );
}

export default App;
