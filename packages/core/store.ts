import { XField, XFieldConf, XFormOption, XFormPreset } from './model'
import { clonePlainObject, mergePlainObject, isNull, isEmpty } from './util/lang'
import { ATTRS, ModeGroup, XFormConf } from '@core/model'
import CONFIG from './config'
import { debug } from 'webpack'

type Store = {
  preset: XFormPreset;
  config: XFormConf;
  fields: Map<string, XFieldConf>;
}

const store: Store = {
  preset: null,
  config: clonePlainObject(CONFIG),
  fields: new Map<string, XFieldConf>()
}

export function useConfig(config: XFormConf){
  const clone = clonePlainObject(config)
  mergePlainObject(store.config, clone)
}

export function usePreset(preset: XFormPreset){
  if(null == preset) return
  store.preset = Object.assign(store.preset || {}, preset)
  console.log('fieldConfs')
  console.log(preset.fieldConfs)

  preset.fieldConfs.forEach(registerField)
}

/** 根据名称注册个字段 */
export function registerField(fc: XFieldConf){
  console.log('registerField')
  console.log(fc)
  if(!(fc instanceof XFieldConf) || !fc.available) return
  
  // store.fields.set(fc.name, fc)
  store.fields.set(fc.type, fc)
  console.log(store.fields)
}

export function use(option: XFormOption){
  debugger
  if(option.config) useConfig(option.config)
  if(option.preset) usePreset(option.preset)
}

export function resetPreset(){
  // 删除字段配置
  const fieldConfs = store.preset?.fieldConfs ?? []
  for(const fc of fieldConfs){
    const value = store.fields.get(fc.type)
    if(fc === value) store.fields.delete(fc.type)
  }

  store.preset = null
}

export function resetConfig(){
  store.config = clonePlainObject(CONFIG)
}

export function reset(option?: XFormOption){
  resetPreset()
  resetConfig()
  if(null != option) use(option)
}

/** 注册任意个字段 */
export function registerManyField(...fcs: XFieldConf[]){
  fcs.forEach(registerField)
}

export function findFieldByElement(target: Element){
  const name = target.getAttribute(ATTRS.XFIELD_NAME)
  const fc = findFieldConf(name)
  if (fc==null){
    const type = target.getAttribute(ATTRS.XFIELD_NAME)
    return findFieldConf(type)
  }
  return fc
}

export function findFieldByXField(target: XField){
  const fc = findFieldConf(target.name)
  if (fc==null){
    return findFieldConf(target.type)
  }
  return fc
  
}
export function findFieldConf(type: string){
  if(isNull(type) || isEmpty(type)) return null

  const fc = store.fields.get(type)
  console.log(fc)
  return fc instanceof XFieldConf ? fc : null
}

export function findMode(mode: string): Array<ModeGroup | string>{
  if(mode == null) return Array.from(store.fields.keys())

  const types = store.config.modes[mode]
  if(!Array.isArray(types)) return []

  return types.filter(t => null != t)
}

export function getConfig(){
  return store.config
}

export function getPreset(){
  return store.preset
}

export default {
  findFieldByElement,
  findFieldByXField,
  findFieldConf,
  findMode,
  getConfig,
  getPreset,
  registerField,
  registerManyField,
  reset,
  resetConfig,
  resetPreset,
  use,
  useConfig
}