"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCurrentUser, updateCurrentUser } from "@/lib/features/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";

const UserProfileMap = dynamic(
  () => import("@/app/(main)/component/UserProfileMap"),
  { ssr: false }
);

interface ProfileForm {
  firstName: string;
  lastName: string;
  address: string;
  coordinates: string;
  phone: string;
}

export default function UserProfilePage() {
  const dispatch = useAppDispatch();
  const { currentUser: user, isLoading } = useAppSelector(
    (state) => state.user
  );

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    address: "",
    coordinates: "",
    phone: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>([
    33.8938, 35.5018,
  ]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    if (user.coordinates) {
      const initialCoords = user.coordinates
        .split(",")
        .map((n) => parseFloat(n.trim())) as [number, number];
      setTimeout(() => setMarkerPos(initialCoords), 0);
    }

    setTimeout(() => {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        coordinates: user.coordinates || "",
        phone: user.phone || "",
      });
    }, 0);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateCurrentUser(form))
        .unwrap()
        .then(() => toast.success("Profile updated successfully"))
        .catch((error) => toast.error(error));
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setMarkerPos(pos);
        setForm((prev) => ({ ...prev, coordinates: `${pos[0]},${pos[1]}` }));
        setLoadingLocation(false);
      },
      () => {
        toast.error("Unable to retrieve your location");
        setLoadingLocation(false);
      }
    );
  };

  const handleClearMarker = () => {
    setMarkerPos(null);
    setForm((prev) => ({ ...prev, coordinates: "" }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Update Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Input
            placeholder="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />

          <Input
            placeholder="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Mark Your Location
            </Label>
            <p className="text-sm text-gray-500">
              Click on the map to mark your delivery location.
            </p>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <UserProfileMap
                markerPos={markerPos}
                setMarkerPos={setMarkerPos}
                setCoordinates={(coords) =>
                  setForm((prev) => ({ ...prev, coordinates: coords }))
                }
              />
            </div>
          </div>

          <Input
            placeholder="Coordinates"
            name="coordinates"
            value={form.coordinates}
            readOnly
            className="border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
          />

          <div className="flex flex-wrap justify-center gap-12 mt-4">
            <Button
              type="button"
              onClick={handleUseMyLocation}
              disabled={loadingLocation}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 shadow-md transition-colors duration-200 text-white font-medium"
            >
              {loadingLocation && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loadingLocation ? "Locating..." : "Use My Location"}
            </Button>

            <Button
              type="button"
              onClick={handleClearMarker}
              className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-200 text-white font-medium"
            >
              Clear Marker
            </Button>

            <Button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md transition-colors duration-200 text-white font-semibold"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
