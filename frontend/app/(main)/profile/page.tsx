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
  const { currentUser: user, isLoading } = useAppSelector((state) => state.user);

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

    const initialCoords = user.coordinates
      ? (user.coordinates.split(",").map(Number) as [number, number])
      : [33.8938, 35.5018];

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      address: user.address || "",
      coordinates: user.coordinates || "",
      phone: user.phone || "",
    });

    setMarkerPos(initialCoords);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(updateCurrentUser(form)).unwrap();
      toast.success("Profile updated successfully");
    } catch (err) {
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
        setForm((prev) => ({
          ...prev,
          coordinates: `${pos[0]},${pos[1]}`,
        }));
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
    <div className="w-full bg-white">
      <div className="p-10 max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Update Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            <Input
              placeholder="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <Input
            placeholder="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <Input
            placeholder="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="h-80">
            <Label className="form-label fw-semibold">
              Mark Your Location on Map
            </Label>
            <p className="text-sm mb-2">
              Click on the map to mark your delivery location.
            </p>

            <UserProfileMap
              markerPos={markerPos}
              setMarkerPos={setMarkerPos}
              setCoordinates={(coords) =>
                setForm((prev) => ({ ...prev, coordinates: coords }))
              }
            />

            <p className="mt-2 text-sm text-gray-500">
              Click on the map to set coordinates.
            </p>
          </div>

          <br />
          <Input
            placeholder="Coordinates"
            name="coordinates"
            value={form.coordinates}
            readOnly
            className="border-0 shadow-none focus:ring-0 pointer-events-none text-black bg-white"
          />

          <div className="flex gap-2 justify-end mb-2">
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              onClick={handleUseMyLocation}
              disabled={loadingLocation}
            >
              {loadingLocation && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loadingLocation ? "Locating..." : "Use My Location"}
            </Button>

            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleClearMarker}
            >
              Clear Marker
            </Button>
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {isLoading? 'Updating':'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
