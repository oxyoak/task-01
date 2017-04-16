class TimetableHeader extends React.Component {
  return (
    <header className="xs-cols-12">
      <div className="logotype"></div>
      <ul>
        {menuItems.map(item => <li>{item}</li>)}
      </ul>
    </header>
  );
}