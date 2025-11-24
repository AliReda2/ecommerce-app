"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteHero from "./components/DeleteHero";

import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
  TableCaption,
  TableHead,
} from "@/components/ui/table";

import type { Hero } from "@/lib/types";

const SortableRow = ({
  item,
  children,
}: {
  item: Hero;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </TableRow>
  );
};

const HeroPage = () => {
  const [items, setItems] = useState<Hero[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hero`, {
        cache: "no-store",
        credentials: "include",
      });
      const payload = await res.json();

      const sorted = [...payload.data].sort((a, b) => a.order - b.order);
      setItems(sorted);
    };

    load();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const rearranged = arrayMove(items, oldIndex, newIndex);

    // Renumber orders starting from 1
    const reordered = rearranged.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setItems(reordered);

    // Prepare minimal payload
    const payload = reordered.map((i) => ({
      id: i.id,
      order: i.order,
    }));

    console.log(payload);

    // Send to backend
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hero/reorder`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table>
          <TableCaption>Drag rows to reorder</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>SubTitle</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>ButtonText</TableHead>
              <TableHead>ImageAlt</TableHead>
              <TableHead>Background</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>isActive</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <SortableRow key={item.id} item={item}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Image
                    src={item.imageUrl || "/images/codart.png"}
                    alt={item.imageAlt}
                    width={60}
                    height={60}
                  />
                  {item.title}
                </TableCell>

                <TableCell>{item.subtitle}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.buttonText}</TableCell>
                <TableCell>{item.imageAlt}</TableCell>
                <TableCell>{item.backgroundColor}</TableCell>
                <TableCell>{item.order}</TableCell>

                <TableCell>
                  <Badge variant={item.isActive ? "success" : "destructive"}>
                    {item.isActive ? "true" : "false"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right flex gap-2">
                  <DeleteHero itemId={item.id} />
                  <Button variant="success">
                    <Link href={`/admin/hero/${item.id}/update`}>Update</Link>
                  </Button>
                </TableCell>
              </SortableRow>
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  );
};

export default HeroPage;
