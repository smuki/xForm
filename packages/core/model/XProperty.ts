
import { getConfig } from '../store'
import { markRaw } from 'vue'
import { AnyProps } from './common'
import { XFieldConf } from '.'

interface Option {
  value: string;
}

/** 
 * 描述预设字段数据的类。
 * 
 * 1. 保存预设字段的配置数据
 */
export class XProperty{
  type: string;
  name: string;  
  title?: string;

  options?: Option[];

  attributes?: { [prop: string]: any };

  // 缓存
  private storage: {
    rawData: any;
    excludeProps: string[];
  } & AnyProps;

  constructor(o: any = {}){
    const params = o instanceof XFieldConf ? o.toParams() : o

    this.type = params.type
    this.name = params.name ?? getConfig().genName(o)
    this.title = params.title
    
    this.options = Array.isArray(params.options) ? params.options : undefined
    this.attributes = params.attributes ?? {}

    Object.defineProperty(this, 'storage', {
      // 在调用reactive()后，该对象被vue3.x使用Proxy代理访问
      // 如果不使用markRaw()标识该字段，在访问storage时，vue3.x会使用reactive()包裹该属性，
      // 由于该属性是只读且不可配置的，所以会抛出错误
      // Uncaught TypeError: 'get' on proxy: property 'storage' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value
      value: markRaw({
        rawData: params,
        excludeProps: ['validation']
      })
    })
  }
}