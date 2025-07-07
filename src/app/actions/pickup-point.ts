"use server";

import { authenticate } from "@/lib/auth";
import { prisma } from "@/lib/prismaDB";
import { errorResponse, successResponse } from "@/lib/response";
import { revalidateTag } from "next/cache";

// create a pickup point 
export async function createPickupPoint(formData: FormData) {
  try {
    // check if user is authenticated
    const session = await authenticate();
    if (!session) return errorResponse(401, "Unauthorized");

    // get form data
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const province = formData.get("province") as string;
    const phone = formData.get("phone") as string;

    // check if required fields are present
    if (!name || !address || !city || !province) {
      return errorResponse(400, "Name, address, city, and province are required");
    }

    // Check if the pickup point already exists (case-insensitive)
    const existingPickupPoint = await prisma.pickupPoint.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    // return error if pickup point already exists
    if (existingPickupPoint) {
      return errorResponse(400, "Pickup point name already exists");
    }

    // Save pickup point to database
    const pickupPoint = await prisma.pickupPoint.create({
      data: {
        name,
        address,
        city,
        province,
        phone,
      },
    });
    revalidateTag("pickup-points");
    return successResponse(201, "Pickup point created successfully", pickupPoint);
  } catch (error: any) {
    console.error("Error creating pickup point:", error?.stack || error);
    return errorResponse(500, error?.message || "Internal server error");
  }
};

// delete a pickup point 
export async function deletePickupPoint(pickupPointId: string) {
  try {
    // check if user is authenticated
    const session = await authenticate();
    if (!session) return errorResponse(401, "Unauthorized");

    if (!pickupPointId) {
      return errorResponse(400, "Pickup point ID is required");
    }

    // Find the pickup point
    const pickupPoint = await prisma.pickupPoint.findUnique({
      where: { id: pickupPointId },
    });

    if (!pickupPoint) {
      return errorResponse(404, "Pickup point not found");
    }

    // Delete pickup point from database
    await prisma.pickupPoint.delete({ where: { id: pickupPointId } });

    revalidateTag("pickup-points");
    return successResponse(200, "Pickup point deleted successfully");
  } catch (error: any) {
    console.error("Error deleting pickup point:", error?.stack || error);
    return errorResponse(500, error?.message || "Internal server error");
  }
};

// update a pickup point 
export async function updatePickupPoint(pickupPointId: string, formData: FormData) {
  try {
    // check if user is authenticated
    const session = await authenticate();
    if (!session) return errorResponse(401, "Unauthorized");

    if (!pickupPointId) {
      return errorResponse(400, "Pickup point ID is required");
    };

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const province = formData.get("province") as string;
    const phone = formData.get("phone") as string;

    if (!name || !address || !city || !province) {
      return errorResponse(400, "Name, address, city, and province are required");
    }

    // **Find the existing pickup point**
    const pickupPoint = await prisma.pickupPoint.findUnique({
      where: { id: pickupPointId },
    });

    if (!pickupPoint) {
      return errorResponse(404, "Pickup point not found");
    }

    // **Update pickup point in database**
    const updatedPickupPoint = await prisma.pickupPoint.update({
      where: { id: pickupPointId },
      data: {
        name,
        address,
        city,
        province,
        phone,
      },
    });

    revalidateTag("pickup-points");

    return successResponse(
      200,
      "Pickup point updated successfully",
      updatedPickupPoint
    );
  } catch (error: any) {
    console.error("Error updating pickup point:", error?.stack || error);
    return errorResponse(500, error?.message || "Internal server error");
  }
}