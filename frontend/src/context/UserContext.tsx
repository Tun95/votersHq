import React, { createContext, useState, ReactNode } from "react";
import { stateRegionMap } from "../utilities/utils/Utils";

// Type definition for StateOfOrigin based on keys from stateRegionMap
export type StateOfOrigin = keyof typeof stateRegionMap;

interface GlobalState {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;

  age: number; // Changed to number
  setAge: React.Dispatch<React.SetStateAction<number>>;

  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;

  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;

  partyImg: string;
  setPartyImg: React.Dispatch<React.SetStateAction<string>>;

  partyName: string;
  setPartyName: React.Dispatch<React.SetStateAction<string>>;

  stateOfOrigin: StateOfOrigin;
  setStateOfOrigin: React.Dispatch<React.SetStateAction<StateOfOrigin>>;

  stateOfResidence: string;
  setStateOfResidence: React.Dispatch<React.SetStateAction<string>>;

  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;

  about: string;
  setAbout: React.Dispatch<React.SetStateAction<string>>;

  education: string;
  setEducation: React.Dispatch<React.SetStateAction<string>>;

  achievement: string;
  setAchievement: React.Dispatch<React.SetStateAction<string>>;

  ninNumber: number; // Changed to number
  setNinNumber: React.Dispatch<React.SetStateAction<number>>;

  emailNotification: boolean;
  setEmailNotification: React.Dispatch<React.SetStateAction<boolean>>;

  smsNotification: boolean;
  setSmsNotification: React.Dispatch<React.SetStateAction<boolean>>;

  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;

  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

 const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState("");

  const [image, setImage] = useState("");
  const [partyImg, setPartyImg] = useState("");
  const [partyName, setPartyName] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState<StateOfOrigin>("Abia"); // Default state as example
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [region, setRegion] = useState(stateRegionMap[stateOfOrigin]); // Set initial region based on stateOfOrigin
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState("");
  const [achievement, setAchievement] = useState("");
  const [ninNumber, setNinNumber] = useState<number>(0);
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update region when stateOfOrigin changes
  React.useEffect(() => {
    setRegion(stateRegionMap[stateOfOrigin]);
  }, [stateOfOrigin]);

  return (
    <GlobalContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        phone,
        setPhone,
        age,
        setAge,
        gender,
        setGender,

        image,
        setImage,
        partyImg,
        setPartyImg,
        partyName,
        setPartyName,
        stateOfOrigin,
        setStateOfOrigin,
        stateOfResidence,
        setStateOfResidence,
        region,
        setRegion,
        about,
        setAbout,
        education,
        setEducation,
        achievement,
        setAchievement,
        ninNumber,
        setNinNumber,
        emailNotification,
        setEmailNotification,
        smsNotification,
        setSmsNotification,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
