import { Types } from "mongoose";
import notesModel from "../../models/notes.model.js";

export async function createNote(req, res) {
    try {
      const {id} = req.params;
      if (!id) {
        return res.status(400).json({ message: "Note id is required in query params" });
      }
        const { title, content } = req.body;
        const note = await notesModel.insertOne({ title, content, userId: new Types.ObjectId(id)});
        res.status(201).json({ message: "Note created successfully", note });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function updateNote(req, res) {
    try {
        const { noteId } = req.params;
        const { id: userId } = req.query;
        const { title, content } = req.body;

        if (!noteId || !userId) {
            return res.status(400).json({ message: "Note id and user id are required" });
        }

        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (content !== undefined) updateFields.content = content;

        const note = await notesModel.findOneAndUpdate(
            { _id: noteId, userId: new Types.ObjectId(userId) },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found or user is not authorized" });
        }

        res.status(200).json({ message: "Note updated successfully", note });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function replaceNote(req, res) {
    try {
        const { noteId } = req.params;
        const { id: userId } = req.query;
        const { title, content } = req.body;

        if (!noteId || !userId) {
            return res.status(400).json({ message: "Note id and user id are required" });
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const note = await notesModel.findOneAndReplace(
            { _id: noteId, userId: new Types.ObjectId(userId) },
            { title, content, userId: new Types.ObjectId(userId) },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found or user is not authorized" });
        }

        res.status(200).json({ message: "Note replaced successfully", note });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function updateAllNotes(req, res) {
    try {
        const { id: userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User id is required in query params" });
        }

        const result = await notesModel.updateMany(
            { userId: new Types.ObjectId(userId) },
            {
                $set: {
                    title: "Updated title",
                    content: "Updated content",
                },
            },
            { runValidators: true }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No notes found for this user or user not exists" });
        }

        const notes = await notesModel.find({ userId: new Types.ObjectId(userId) });

        res.status(200).json({ message: "All notes updated successfully", result, notes });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function deleteNote(req, res) {
    try {
        const { noteId } = req.params;
        const { id: userId } = req.query;

        if (!noteId || !userId) {
            return res.status(400).json({ message: "Note id and user id are required" });
        }

        const deletedNote = await notesModel.findOneAndDelete({
            _id: noteId,
            userId: new Types.ObjectId(userId),
        });

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found or user is not authorized" });
        }

        res.status(200).json({ message: "Note deleted successfully", note: deletedNote });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function getPaginatedNotes(req, res) {
    try {
        const { id: userId, page = 1, limit = 3 } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User id is required in query params" });
        }

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 3;
        const skip = (pageNumber - 1) * pageSize;

        const notes = await notesModel.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: pageSize },
        ]);

        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function getNoteByContent(req, res) {
    try {
        const { content, id: userId } = req.query;

        if (!content || !userId) {
            return res.status(400).json({ message: "Content and user id are required" });
        }

        const note = await notesModel.findOne({
            content,
            userId: new Types.ObjectId(userId),
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note fetched successfully", note });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function getNotesWithUser(req, res) {
    try {
        const { id: userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User id is required in query params" });
        }

        const notes = await notesModel.aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    userId: 1,
                    createdAt: 1,
                    email: "$user.email",
                },
            },
        ]);

        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function getAggregatedNotes(req, res) {
    try {
        const { id: userId, title } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User id is required in query params" });
        }

        const match = { userId: new Types.ObjectId(userId) };

        if (title) {
            match.title = { $regex: title, $options: "i" };
        }

        const notes = await notesModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    userId: 1,
                    name: "$user.name",
                    email: "$user.email",
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function deleteAllNotes(req, res) {
    try {
        const { id: userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User id is required in query params" });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const result = await notesModel.deleteMany({
            userId: new Types.ObjectId(userId),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No notes found for this user" });
        }

        res.status(200).json({ message: "All notes deleted successfully", result });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}

export async function getNote(req, res) {
    try {
        const { id: noteId } = req.params;
        const { id: userId } = req.query;

        if (!noteId || !userId) {
            return res.status(400).json({ message: "Note id and user id are required" });
        }

        const note = await notesModel.findOne({
            _id: noteId,
            userId: new Types.ObjectId(userId),
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found or user is not authorized" });
        }

        res.status(200).json({ message: "Note fetched successfully", note });
    } catch (error) {
        res.status(500).json({ message: "error", error: error.message });
    }
}