"use client";

import { useEffect, useState } from "react";
import { Add, Search, Person } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { dark } from "@clerk/themes";
import Loader from "@components/Loader";

const TopBar = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const getUser = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}`);
      if (!response.ok) throw new Error('Error fetching user data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error(error);
      // Manejo de errores
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const router = useRouter();
  const [search, setSearch] = useState("");

  return !isLoaded || loading ? (
    <Loader />
  ) : (
    <div className="flex justify-between items-center mt-6">
      <div className="relative">
        <input
          type="text"
          className="search-bar"
          placeholder="Search posts, people, ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search
          className="search-icon"
          onClick={() => router.push(`/search/posts/${search}`)}
        />
      </div>

      <button
        className="create-post-btn"
        onClick={() => router.push("/create-post")}
      >
        <Add /> <p>Create A Post</p>
      </button>

      <div className="flex gap-4 md:hidden">
        {userData?._id && (
          <Link href={`/profile/${userData._id}/posts`}>
            <Person sx={{ fontSize: "35px", color: "white" }} />
          </Link>
        )}
        <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
};

export default TopBar;
