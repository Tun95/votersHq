import "./styles.scss";
import f1 from "../../../assets/home/f1.png";
import f2 from "../../../assets/home/f2.png";
import f3 from "../../../assets/home/f3.png";

function Featuring() {
  const featured = [
    {
      img: f1,
      name: "Legislative Bill Summaries",
      description:
        "We provide easy-to-understand summaries of bills and issues, along with their pros and cons, using AI technology.",
    },
    {
      img: f2,
      name: "Citizens Voting on Bills",
      description:
        "Users can vote on national or state issues and bills, expressing their support or opposition with a simple YEA or NAY vote.",
    },
    {
      img: f3,
      name: "Election Opinion Polls",
      description:
        "We conducts election opinion polls, from state  to national elections, helping gauge public sentiment and preferences before the actual elections.",
    },
  ];

  return (
    <div className="featured" id="features">
      <div className="container">
        <div className="content">
          <div className="header_text p_flex">
            <div className="header">
              <h1>Featuring</h1>
            </div>
            <div className="text">
              <p>
                We envision a future where every citizen feels empowered and
                equipped to actively participate in shaping their government's
                decisions, leading to more accountable and representative
                governance.
              </p>
            </div>
          </div>
          <div className="box p_flex">
            <div className="box_list">
              {featured?.map((item, index) => (
                <div className="list" key={index}>
                  <div className="list_content">
                    <div className="img l_flex">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="name">
                      <h4>{item.name}</h4>
                    </div>
                    <div className="description">
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="list_shadow"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featuring;
