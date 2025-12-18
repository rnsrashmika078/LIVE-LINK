import { UserCard } from "@/app/component/ui/cards";
import React from "react";


const FrequentContact = () => {
  return (
    <>
      <p className="sub-header py-2">Frequently contact</p>
      <div className="flex w-full flex-col justify-start items-center">
        {[...Array(5)].map((_, i) => (
          <UserCard
            avatar="/dog.png"
            // createdAt={}
            useFor="chat"
            key={i}
            name="Kusal Perera"
          />
        ))}
      </div>
    </>
  );
};

export default FrequentContact;
