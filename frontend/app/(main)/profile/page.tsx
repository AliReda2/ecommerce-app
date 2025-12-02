'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCurrentUser, updateCurrentUser } from '@/lib/features/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import useGoBack from '@/hooks/useGoBack';

const UserProfileMap = dynamic(
  () => import('@/app/(main)/profile/components/UserProfileMap'),
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
  const goBack = useGoBack();

  const { currentUser: user, isLoading } = useAppSelector(
    (state) => state.user
  );

  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    address: '',
    coordinates: '',
    phone: '',
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
        .split(',')
        .map((n) => parseFloat(n.trim())) as [number, number];
      setTimeout(() => setMarkerPos(initialCoords), 0);
    }

    setTimeout(() => {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        coordinates: user.coordinates || '',
        phone: user.phone || '',
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
        .then(() => toast.success('Profile updated successfully'))
        .catch((error) => toast.error(error));
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const pos: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setMarkerPos(pos);

        // coordinates
        const coordsStr = `${pos[0]},${pos[1]}`;
        setForm((prev) => ({ ...prev, coordinates: coordsStr }));

        // reverse geocode → address
        const address = await reverseGeocode(pos[0], pos[1]);

        if (address) {
          setForm((prev) => ({ ...prev, address }));
        } else {
          toast.error('Unable to get address from coordinates.');
        }

        setLoadingLocation(false);
      },
      () => {
        toast.error('Unable to retrieve your location');
        setLoadingLocation(false);
      }
    );
  };

  const handleClearMarker = () => {
    setMarkerPos(null);
    setForm((prev) => ({ ...prev, coordinates: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div
        className="w-full flex
      lg:ml-10
      xl:ml-10
      2xl:ml-20
      "
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-700 mb-6 hover:text-gray-900 transition hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Update Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              aria-label="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              placeholder="Last Name"
              aria-label="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Input
            placeholder="Address"
            aria-label="address"
            value={form.address}
            onChange={handleChange}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />

          <Input
            placeholder="Phone"
            aria-label="phone"
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
            aria-label="coordinates"
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
              {loadingLocation ? 'Locating...' : 'Use My Location'}
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
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your@email.com)',
        },
      }
    );

    if (!res.ok) return '';
    const data = await res.json();
    return data.display_name || '';
  } catch {
    return '';
  }
}
