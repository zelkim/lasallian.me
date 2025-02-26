import Org from '../models/Org.js';

/**
 * Creates a new organization.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const createOrg = async (req, res) => {
  const data = req.body;

  Org.create(data)
    .then((org) => {
      return res.status(200).send({ status: 'ok', msg: 'Organization created.', data: org });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ status: 'error', msg: 'Organization could not be created.' });
    });
};

/**
 * Retrieves an organization by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getOrgById = async (req, res) => {
  try {
    const org = await Org.findById(req.params.id).exec();

    if (!org)
      return res.status(400).json({ status: 'error', error: 'Could not find organization' });

    return res.status(200).json({ status: 'ok', data: org });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', error: 'Could not get organization' });
  }
};

/**
 * Retrieves an organization by its acronym.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getOrgByAcronym = async (req, res) => {
  try {
    const org = await Org.findOne({ "info.acronym": req.params.acronym }).exec();

    if (!org)
      return res.status(400).json({ status: 'error', error: 'Could not find organization' });

    return res.status(200).json({ status: 'ok', data: org });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', error: 'Could not get organization' });
  }
};

import OrgInfo from "../models/orgInfo.js";

/**
 * Updates organization information.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const UpdateOrgInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      $set: {
        ...req.body,
        "meta.updated_at": new Date()
      }
    };

    const updatedOrg = await OrgInfo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({ status: 'error', msg: 'Organization not found' });
    }

    res.status(200).json({
      status: 'success',
      organization: updatedOrg
    });
  } catch (err) {
    console.error('UpdateOrgInfo Error:', err);
    res.status(400).json({
      status: 'error',
      msg: err.message.replace('Error: ', '')
    });
  }
};

/**
 * Deletes an organization by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const DeleteOrgInfo = async (req, res) => {
  try {
    const org = await OrgInfo.findByIdAndDelete(req.params.id);
    if (!org) {
      return res.status(404).json({ status: 'error', msg: 'Organization not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Organization deleted successfully.'
    });
  } catch (err) {
    console.error('DeleteOrgInfo Error:', err);
    return res.status(400).json({
      status: 'error',
      msg: err.message.replace('Error: ', '')
    });
  }
};

