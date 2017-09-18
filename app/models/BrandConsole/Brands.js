import Fetch from '../../services/fetch/index'

const Brands = {}

Brands.getBrands = async function (brandId) {
  try {
    return await new Fetch()
      .get(`/brands/${brandId}?associations[]=brand.roles&associations[]=brand_role.members`)
  } catch (error) {
    return { error }
  }
}

Brands.getChildrenBrands = async function (brandId) {
  try {
    return await new Fetch()
      .get(`/brands/${brandId}/children?associations[]=brand.roles&associations[]=brand_role.members`)
  } catch (error) {
    return { error }
  }
}

Brands.addBrand = async function (brand) {
  try {
    return await new Fetch()
      .post('/brands?associations[]=brand.roles')
      .send(brand)
  } catch (error) {
    return { error }
  }
}

Brands.editBrand = async function (brand) {
  try {
    return await new Fetch()
      .put(`/brands/${brand.id}`)
      .send(brand)
  } catch (error) {
    return { error }
  }
}

Brands.deleteBrand = async function (brandId) {
  try {
    return await new Fetch()
      .delete(`/brands/${brandId}`)
  } catch (error) {
    return { error }
  }
}
export default Brands
