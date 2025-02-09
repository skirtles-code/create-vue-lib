import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import MyPanel from '../MyPanel.vue'

describe('MyPanel', () => {
  test('Just a body', () => {
    const wrapper = mount(MyPanel)

    expect(wrapper.findAll('.panel-section')).toHaveLength(1)
    expect(wrapper.findAll('.panel-body')).toHaveLength(1)
    expect(wrapper.findAll('.panel-footer')).toHaveLength(0)
    expect(wrapper.findAll('.panel-header')).toHaveLength(0)
  })

  test('title prop', () => {
    const wrapper = mount(MyPanel, {
      props: {
        title: 'Title'
      }
    })

    expect(wrapper.findAll('.panel-section')).toHaveLength(2)
    expect(wrapper.findAll('.panel-body')).toHaveLength(1)
    expect(wrapper.findAll('.panel-footer')).toHaveLength(0)
    expect(wrapper.findAll('.panel-header')).toHaveLength(1)

    expect(wrapper.get('.panel-header').text()).toBe('Title')
  })

  test('footer prop', () => {
    const wrapper = mount(MyPanel, {
      props: {
        footer: 'Footer'
      }
    })

    expect(wrapper.findAll('.panel-section')).toHaveLength(2)
    expect(wrapper.findAll('.panel-body')).toHaveLength(1)
    expect(wrapper.findAll('.panel-footer')).toHaveLength(1)
    expect(wrapper.findAll('.panel-header')).toHaveLength(0)

    expect(wrapper.get('.panel-footer').text()).toBe('Footer')
  })

  test('title and footer props', () => {
    const wrapper = mount(MyPanel, {
      props: {
        title: 'Both title',
        footer: 'and footer'
      }
    })

    expect(wrapper.findAll('.panel-section')).toHaveLength(3)
    expect(wrapper.findAll('.panel-body')).toHaveLength(1)
    expect(wrapper.findAll('.panel-footer')).toHaveLength(1)
    expect(wrapper.findAll('.panel-header')).toHaveLength(1)

    expect(wrapper.get('.panel-header').text()).toBe('Both title')
    expect(wrapper.get('.panel-footer').text()).toBe('and footer')
  })
})
